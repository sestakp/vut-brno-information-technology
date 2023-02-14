#!/bin/python3
import argparse
import sys
import requests, json
from time import sleep

SHOP_URL = "https://thepihut.com/"
PRODUCT_URL = SHOP_URL + "products/"
PRODUCTS_URL = SHOP_URL + "products.json?limit="

PAGE_SIZE = 250

# get parametr
argParser = argparse.ArgumentParser(description='Ind./exátor thepihut.com')
argParser.add_argument('--count', metavar='count',  help='Počet prokuktů', default=300, type=int)
args = argParser.parse_args()

# print urls
page_count = 1
remaing_number_of_products = args.count
while remaing_number_of_products:

    if remaing_number_of_products > PAGE_SIZE:
        products_to_download = PAGE_SIZE
    else:
        products_to_download = remaing_number_of_products

    try:
        response = requests.get(PRODUCTS_URL + str(products_to_download) + "&page=" + str(page_count), timeout=(5, 5))
        page_count += 1

        data = response.json()
        if len(data) == 0:
            break

        for product in data["products"]:
            print(PRODUCT_URL + product["handle"])
            remaing_number_of_products -= 1
    except requests.exceptions.Timeout as err:
        print("shopify reqvest limit out, wating", file=sys.stderr)
        sleep(20)