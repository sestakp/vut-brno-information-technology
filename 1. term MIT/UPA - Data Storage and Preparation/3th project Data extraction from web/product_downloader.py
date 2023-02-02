#!/bin/python3
import argparse
import sys
import requests, json
from time import sleep

print("name\tprice\tbrand\tgrams")

for line in sys.stdin:
    product_url = line.split("\n")[0]
    
    while True:
        try:
            response = requests.get(product_url + ".json", timeout=(5, 5))

            data = response.json()
            if len(data) == 0:
                break

            product_data = data["product"]
            print("{}\t{}\t{}\t{}".format(product_data["title"], product_data["variants"][0]["price"], product_data["vendor"], product_data["variants"][0]["grams"]))

            break
        except requests.exceptions.Timeout as err:
            print("shopify reqvest limit out, wating", file=sys.stderr)
            sleep(20)