# Wappalyzer API

This repository contains a dockerized and 'API-fied' version of [Wappalyzer](https://github.com/AliasIO/Wappalyzer). It aims to make it available through an API endpoint you can call from anywhere.

Pull the images from the Docker Hub to use the API right away: [https://hub.docker.com/r/asharifr/wappalyzer-api](https://hub.docker.com/r/asharifr/wappalyzer-api).

## To build it:

```
docker build -t asharifr/wappalyzer-api:6.92 .
docker push asharifr/wappalyzer-api:6.92
docker pull asharifr/wappalyzer-api:6.92
```

## To run it:

```bash
# Locally
docker run -d -t -i -p 4000:3000 asharifr/wappalyzer-api:6.92
# Check requests
docker attach <id>
# Attach bash to the process
docker exec -it <container name> /bin/sh
# Remotely
docker run -d -t -i -p 80:3000 asharifr/wappalyzer-api:6.92
```

## To use it:

```
curl 'localhost:4000/extract?url=https://drsquatch.com/'
```

## Changelog

### 6.92

- Upgrade Wappalyzer version from 6.9.2 -> 6.10.18

### 6.91

- Add `tini` to Docker image to avoid zombie processes.

## License:

Derived work of [Wappalyzer](https://github.com/AliasIO/Wappalyzer/).
Licensed under [GPL-3.0](https://opensource.org/licenses/GPL-3.0).
