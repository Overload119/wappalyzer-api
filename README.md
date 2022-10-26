# Wappalyzer API

This repository contains a dockerized and 'API-fied' version of [Wappalyzer](https://github.com/AliasIO/Wappalyzer). It aims to make it available through an API endpoint you can call from anywhere.

Pull the images from the Docker Hub to use the API right away: [https://hub.docker.com/r/asharifr/wappalyzer-api](https://hub.docker.com/r/asharifr/wappalyzer-api).

## To build it:

```
docker build -t asharifr/wappalyzer-api:6.94 .
docker push asharifr/wappalyzer-api:6.94
docker pull asharifr/wappalyzer-api:6.94
```

## To run it:

```bash
# Locally
docker run --name wappalyzer -d -t -i -p 4000:3000 asharifr/wappalyzer-api:6.94
# Check requests
docker attach wappalyzer
# Attach bash to the process
docker exec -it wappalyzer /bin/sh
# Remotely
docker run -d -t -i -p 80:3000 asharifr/wappalyzer-api:6.94
# Stress-test
hey -n 100 -c 4 -q 6 -z 2m 'http://localhost:4000/extract?url=https://drsquatch.com/'
```

## To use it:

```
curl 'http://localhost:4000/extract?url=https://drsquatch.com/'
```

## Changelog

### 6.94

- Better support for killing Chromium zombie processes if Wappalyzer does not destroy it.
- Use `cluster` to support more than 1 CPU.
- Support `recursive` as a query parameter.

### 6.93

- Upgrade Wappalyzer version from 6.10.18 -> 6.10.41

### 6.92

- Upgrade Wappalyzer version from 6.9.2 -> 6.10.18

### 6.91

- Add `tini` to Docker image to avoid zombie processes.

## License:

Derived work of [Wappalyzer](https://github.com/AliasIO/Wappalyzer/).
Licensed under [GPL-3.0](https://opensource.org/licenses/GPL-3.0).
