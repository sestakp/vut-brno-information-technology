# BUT-FIT-UPA

Vyhledávač vlakových spojení s NoSQL (MongoDB) backendem.

## Spuštění a příprava na spuštění
### Docker

Build obrazu
```sh
docker build . -t xpleva07upa
```

Spuštění
```sh
docker run xpleva07upa python3 /app/main.py
```

### Python3

Stažení závislostí
```sh
pip install -r requirements.txt
#or
pip3 install -r requirements.txt
```

Spuštění
```sh
python3	main.py
```

## Použití

```sh
usage: main.py [-h] [--update] [--start stanice] [--end stanice] [--time čas]
               [--findStation regex]

Vyhladávač vlakových spojení

options:
  -h, --help           show this help message and exit
  --update             Provede aktualizaci záznamů spojů v databázi
  --start stanice      Počáteční stanice cesty
  --end stanice        Cílová stanice cesty
  --time čas           Čas zahájení cesty
  --findStation regex  Najít stanici v DB pomocí regex
```