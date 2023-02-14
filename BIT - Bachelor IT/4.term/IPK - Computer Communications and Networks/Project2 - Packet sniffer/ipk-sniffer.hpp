/**
 *  \file ipk-sniffer.hpp
 *  \date 24.4.2021
 *  \author Pavel Sestak 
 */

#ifndef IPKSNIFFER_H
    #define IPKSNIFFER_H

    #include <iostream>
    #include <pcap.h> //Library for packet sniffing www.tcpdump.org/pcap.html
    #include<netinet/tcp.h>	//Provides declarations for tcp header
    #include<netinet/ip.h>	//Provides declarations for ip header
    #include<netinet/ip6.h>	//Provides declarations for ip6 header
    #include <sstream>
    #include <cstring>
    #include <boost/format.hpp> //Format hexa numbers

    /**
     * Flag specified TCP filter
     */ 
    #define TCPFLAG 1
    /**
     * TCP Protocol number specified by IANA protocol table
     */ 
    #define TCP_PROTOCOL 0x06

    /**
     * Flag specified UDP filter
     */ 
    #define UDPFLAG 2
    /**
     * UDP Protocol number specified by IANA protocol table
     */ 
    #define UDP_PROTOCOL 0x11

    /**
     * Flag specified ICMP filter
     */ 
    #define ICMPFLAG 4

    /**
     * ICMP Protocol number specified by IANA protocol table
     */ 
    #define ICMP_PROTOCOL 0x01

    /**
     * Flag specified ARP filter
     */ 
    #define ARPFLAG 8

    /**
     * Specified IPV4 Type of packet on link layer
     */ 
    #define ETHER_TYPE_IPV4 0x800

    /**
     * Specified IPV6 Type of packet on link layer
     */ 
    #define ETHER_TYPE_IPV6 0x86dd

    /**
     * Specified ARP Type of packet on link layer
     */ 
    #define ETHER_TYPE_ARP 0x0806



    /**
     * Information about length of link layer head which is depends on protocol
     */ 
    uint layer_2_header_length;
    /**
     * Hold flags for filterng
     */
    uint8_t flags = 0;
    /**
     * Specified how many packets to display and process, can be modified by parameter -n
     */ 
    int packet_show = 1;
    /**
     * Specified which port to filter, in default is port filtering disabled, can be specified by parameter -p
     */ 
    int port = 0;
    /**
     * Interface name for sniffering specified by -i
     */ 
    char* interface = nullptr;

    /**
     * Check if mandatory interface argument was specified
     */ 
    bool argumentInterface = false;


    /** Print message to standard error output and exit program with non zero exit code.  
     *  \param message detail information about error to dispay
     */  
    void printError(std::string message);

    /** Parse arguments and fill global variables  
     *  \param argc argument count
     *  \param argv array of arguments  
    */  
    void argumentParse(int argc, char *argv[]);

    /** Print all available interfaces
     *  \param message detail information about error to dispay
     *  \pre argumentParse
     *  \return Exit program with 0 return value.  
    */  
    void PrintInterfaces();

    /** Open connection for sniffing and set filtering.  
     *  \param interface interface name
     *  \pre argumentParse
     *  \post closeConnection
     *  \return Handle of specified interface.  
    */  
    pcap_t* openConnection(char* interface);

    /** Format timeval to specified timestamp.  
     *  \param tv_arg timestamp from packet header
     *  \pre printPacketHeader
     *  \return formated timestamp in string.  
    */  
    std::string getDateTime(timeval tv_arg);

    /** Format uint32 with network byte order to ipv4 string.  
     *  \param address address to convert with network byteorder
     *  \pre printPacketHeader
     *  \return formated IPV4 address in string.  
    */  
    std::string getIpV4(uint32_t address);

    /** Print header of packet on standard output.  
     *  \param etthdr ethernet header of current packet
     *  \param tcph tcp header of current packet
     *  \param header pcap pktheader with basic information about packet
     *  \param bufferSize size of whole packet
     *  \param buffer packet in raw format
     *  \pre processPacket  
    */  
    void printPacketHeader(struct ether_header *etthdr, struct tcphdr *tcph, const struct pcap_pkthdr *header, int bufferSize, const u_char *buffer );

    /** Print data of packet on standard output in hexa and ascii format.  
     *  \param data packet in raw
     *  \param data_length length of packet
     *  \pre processPacket  
    */  
    void printData(u_char *data, int data_length);

    /** Function to proccess each packet.  
     *  \param args arguments
     *  \param header header of current packet
     *  \param buffer packet data
     *  \pre openConnection  
    */  
    void processPacket(__attribute__((unused)) u_char *args, const struct pcap_pkthdr *header, const u_char *buffer);

    /** Close already opened interface for sniffing
     *  \param handle handle of current interface to close
     *  \pre openConnection  
    */  
    void closeConnection(pcap_t *handle);







#endif