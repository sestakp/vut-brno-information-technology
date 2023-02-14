/**
 * \file ipk-sniffer
 * \date 16.4.2021
 * \author Pavel Šesták (xsesta07)
 */

#include "ipk-sniffer.hpp"

void printError(std::string message){
    std::cerr << "ERROR>" << message << "<\n";
    exit(EXIT_FAILURE);
}

void argumentParse(int argc, char *argv[]){
    
    for(int i = 1; i < argc; i++){
        
        std::string arg = argv[i];

        if(arg.compare("-i") == 0 || arg.compare("--interface") == 0){
            argumentInterface = true;
            if((i+1) < argc){
                interface = argv[i+1];
                i++;
            }
        }
        else if(arg.compare("-p") == 0){
            if((1+i) < argc){ 
                char *p;
                port = strtol(argv[i+1],&p,10);
                if(argv[i+1] == p){
                    printError("Argument -p expected port number");
                }
                i++;
            }
            else{
                printError("Argument -p without value");
            }
        }
        else if(arg.compare("-t") == 0 || arg.compare("--tcp") == 0){
            flags += TCPFLAG;
        }
        else if(arg.compare("-u") == 0 || arg.compare("--udp") == 0){
            flags += UDPFLAG;
        }
        else if(arg.compare("--icmp") == 0){
            flags += ICMPFLAG;
        }
        else if(arg.compare("--arp") == 0){
            flags += ARPFLAG;
        }
        else if(arg.compare("-n") == 0){
            if(i+1 < argc){
                char *p;
                packet_show = strtol(argv[i+1],&p,10);
                if(argv[i+1] == p){
                    printError("Argument -n expected number");
                }
                i++;
            }
            else{
                printError("Argument -n without value");
            }
        }
        else{
            printError("Unknown argument");
        }
    }
}

void PrintInterfaces(){
    char errbuf[PCAP_ERRBUF_SIZE];
    pcap_if_t *interfaces,*iterator;
    int i=0;
    if(pcap_findalldevs(&interfaces,errbuf) == PCAP_ERROR )
    {
        printf("error in pcap findall devs\n");
        exit(EXIT_FAILURE);   
    }
    for(iterator=interfaces;iterator;iterator=iterator->next)
    {
        printf("%s\n",iterator->name);
       
    }
}

pcap_t* openConnection(char* interface){
    char errbuf[PCAP_ERRBUF_SIZE];
    pcap_t *handle;
    handle = pcap_open_live(interface,BUFSIZ, 1, 1000, errbuf);

    if(handle == nullptr){
        fprintf(stderr,"Error while opening interface\n"); exit(1);
    }

    std::string filter = "";
    //set filtering 
    if(flags & TCPFLAG){
        filter += "tcp";    
    }
    if(flags & UDPFLAG){
        if(filter.length() > 0) { filter += " or "; }
        filter += "udp";
    }
    if(flags & ICMPFLAG){
        if(filter.length() > 0) { filter += " or "; }
        filter += "icmp or icmp6";
    }
    if(flags & ARPFLAG){
        if(filter.length() > 0) { filter += " or "; }
        filter += "arp";
    }
    if(port != 0){
        if(filter.length() > 0) { filter += " and "; }
        filter += "port "+std::to_string(port);
    }
    
    if (flags != 0 || port != 0){

        bpf_program fp;

        if(pcap_compile(handle,&fp,filter.c_str(),0,PCAP_NETMASK_UNKNOWN) == PCAP_ERROR)
        { fprintf(stderr,"Error calling pcap_compile\n"); exit(1); }

        /* set the compiled program as the filter */
        if(pcap_setfilter(handle,&fp) == PCAP_ERROR )
        { fprintf(stderr,"Error setting filter\n"); exit(1); }
    }


    if(handle == NULL){
        std::cerr << "Coudn't open defice: " << errbuf << "\n";
        exit(EXIT_FAILURE);
    }

    switch ( pcap_datalink(handle) ) 
    {
    case DLT_EN10MB: // Ethernet header
        layer_2_header_length = 14;
        break;

    case DLT_LINUX_SLL: // Linux cooked header
        layer_2_header_length = 16;
        break;

    }
    return handle;
} 

std::string getDateTime(timeval tv_arg){
    
    timeval tv = tv_arg;

    gettimeofday(&tv,NULL);

    uint64_t millis = (tv.tv_sec * (uint64_t)1000) + (tv.tv_usec / 1000);

    tm *ti = localtime(&tv.tv_sec);
    char datetime[100];
    char timezone[7];
    strftime(datetime, 100, "%FT%T", ti);
    
    strftime(timezone,7,"%z",ti);
    std::stringstream tzss;
    tzss << timezone;

    std::stringstream headerss;
    headerss << datetime << "." << std::to_string(millis).substr(0,3) << tzss.str().substr(0,3) << ":" << tzss.str().substr(3,5)<< " ";

    return headerss.str();
}

std::string getIpV4(uint32_t address){
    struct in_addr adr;
    adr.s_addr = (uint32_t) address;
    return inet_ntoa(adr);
}

void printPacketHeader(struct ether_header *etthdr, struct tcphdr *tcph, const struct pcap_pkthdr *header, int bufferSize, const u_char *buffer ){
    
    struct iphdr *iph = (struct iphdr*)(buffer + layer_2_header_length);
    std::string source_addr = "";
    std::string source_port = "";
    std::string destination_addr = "";
    std::string destination_port = "";
    uint8_t protocol = iph->protocol;
    uint16_t ether_type;
    memcpy(&ether_type, (buffer + layer_2_header_length -2), 2); //get last two bytes from layer_2_header which represent type
	
    //set source and destination addresses
    switch(ntohs(ether_type))
    {
        case ETHER_TYPE_ARP:
            {
		        uint8_t *source;
                uint8_t *dest;
                if(layer_2_header_length == 14){ //Ethernet2
                    source = (uint8_t *) buffer + 6 ;
                    dest = (uint8_t *)buffer;
                }
                else if (layer_2_header_length == 16){//Linux cooked capture
                    source = (uint8_t *) (buffer + 24);
                    dest = (uint8_t *) (buffer + 34);
                    
                }
		
		        char source_char [18] = {'\0'};
		        char dest_char[18] = {'\0'};		

		        sprintf(source_char, "%02hhX:%02hhX:%02hhX:%02hhX:%02hhX:%02hhX",source[0], source[1], source[2], source[3], source[4], source[5]);
		        sprintf(dest_char, "%02hhX:%02hhX:%02hhX:%02hhX:%02hhX:%02hhX", dest[0], dest[1], dest[2], dest[3], dest[4], dest[5]);	

                source_addr =  source_char;
                destination_addr = dest_char;
            }
          break;

        case ETHER_TYPE_IPV6:
            {
		
                struct ip6_hdr *ip6Hdr;
                ip6Hdr = (struct ip6_hdr*) (buffer + layer_2_header_length);
                
                char src6[INET6_ADDRSTRLEN];
                char dst6[INET6_ADDRSTRLEN];
		
                inet_ntop(AF_INET6,&(ip6Hdr->ip6_src), src6, INET6_ADDRSTRLEN);
                inet_ntop(AF_INET6,&(ip6Hdr->ip6_dst), dst6, INET6_ADDRSTRLEN);
            	
                source_addr = src6;
                destination_addr = dst6;
                protocol = ip6Hdr->ip6_ctlun.ip6_un1.ip6_un1_nxt;		
				
	    }
            break;

        case ETHER_TYPE_IPV4:
        default:
            {
                source_addr = getIpV4(iph->saddr);
                destination_addr = getIpV4(iph->daddr);
            }
            break;
    }

    //set ports
    switch(iph->protocol){
        case TCP_PROTOCOL:
        case UDP_PROTOCOL:
            source_port = " : " + std::to_string(ntohs(tcph->source));
            destination_port = " : " + std::to_string(ntohs(tcph->dest));
        break;

        case ICMP_PROTOCOL:
        
        break;
    }
    

    std::cout << getDateTime(header->ts);
    
    std::cout << source_addr << source_port << " > " << destination_addr << destination_port << ", length " << bufferSize << " bytes";

    std::cout << std::endl;
}

void printData(u_char *data, int data_length){
    
    int i = 0;
    while(i < data_length){
        
        //Print byte offset in hexa
        std::cout << boost::format("0x%04x: ") % i;
        
        int j;
        //Print HEXA
        for(j = i; (j < (i+16)) && (j < data_length); j++){
            std::cout << boost::format("%02x ") % (int)data[j];
            if(j == (i+7)) { std::cout << " "; }
        }

        //Allign data
        for(int k = j; (k < (i+16)); k++) {
            std::cout << "   ";
        }
        std::cout << " ";


        //PrintAscii
        for(j = i; (j < (i+16)) && (j < data_length); j++){
            if(isprint(data[j])){
                std::cout << data[j];
            }
            else{
                std::cout << ".";
            }

            if(j == (i+7)) { std::cout << " "; }
        }

        i+= 16;
        std::cout << std::endl;
    }

    std::cout << std::endl;
}

void processPacket(__attribute__((unused)) u_char *args, const struct pcap_pkthdr *header, const u_char *buffer){
    
    int bufferSize = header->len;
    
    struct ether_header *ethhdr = (struct ether_header *) buffer;

    
    const int ipHeaderLength = sizeof(struct iphdr); //20bytes

    struct tcphdr *tcph=(struct tcphdr*)(buffer + ipHeaderLength + layer_2_header_length);

    printPacketHeader(ethhdr,tcph,header,bufferSize, buffer);
    printData((u_char *)buffer,bufferSize);

}

void closeConnection(pcap_t *handle){
    pcap_close(handle);
}

void printHelp(){
    std::cerr << "Utility ipk-sniffer" << std::endl;
    std::cerr << "Usage: ./ipk-sniffer [-i rozhraní | --interface rozhraní] {-p ­­port} {[--tcp|-t] [--udp|-u] [--arp] [--icmp] } {-n num}" << std::endl;
    std::cerr << "This utility require root privileges for correct use" << std::endl;
}

int main(int argc, char *argv[]){

    argumentParse(argc,argv);

    if(argumentInterface == false){
        printHelp();
        exit(EXIT_SUCCESS);
    }

    if(interface == nullptr){
        PrintInterfaces();
        exit(EXIT_SUCCESS);
    }

    pcap_t *handle;

    handle = openConnection(interface);
    
    pcap_loop(handle, packet_show, processPacket, NULL);

    closeConnection(handle);

    return EXIT_SUCCESS;
}
