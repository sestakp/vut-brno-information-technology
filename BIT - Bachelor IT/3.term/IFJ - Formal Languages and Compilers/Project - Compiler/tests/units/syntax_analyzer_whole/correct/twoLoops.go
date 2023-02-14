package main

func main(){

	for i := 1; i <= 10; i = i + 1 {
		
		for j := 1; j <= 10; j = j + 1 {
			print(i)
			print(j)
			for k := i; k < j; k = k + 1 {
				print(k)
			}
		}
		//i = i + 5 // POZOR na i := i + 5, nekonecna smycka
	}
}