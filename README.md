# Introduction

This project is a part of Hack4Sweden hackathon solution called Redistributed resilient crisis information. This project is aimed is to use distributed networks to spread crisis related informaton (e.g. messages from Police).
This git is a part of a solution consisting of 2 parts, polisen-events-downloader and polisen-events-share-dat

*polisen-events-downloader* is a server that downloads archive of Police events in JSON format that have happened recently and saves them to some folder in human readable format
*polisen-events-share-dat* reads this folder and shares these events in dat based network.

# Running the project

### polisen-events-share-dat
1. Create a dat archive beforehand with "dat share". Remember where is it located, as it is going to be used for sharing later
2. Export secret key with command "dat keys export"
3. Create a file called *secrets* in folder *secrets* containing a key from step 2
4. Run the following commands to build and start Docker container. Change only /FOLDERTOSHARE parameter to absolute path to dat archive from step 1
`docker build -t polisen-events-share-dat .`
`docker run -d  -p 3282:3282 -v /FOLDERTOSHARE:/data -v $PWD/secrets:/secrets --restart unless-stopped --name polisen-events-share-dat-instance polisen-events-share-dat`
5. If needed you can access Docker:
`docker exec -it polisen-events-share-dat-instance bash`

### polisen-events-downloader
1. Use the same data folder in your server as in polisen-events-share-dat, this docker is going to download automatically all data to this folder and polisen-events-share-dat is going to share it in dat network. Run following commands, change only /FOLDERTOSHARE parameter to absolute path to dat archive from step 1
`docker build -t polisen-events-downloader .`
`docker run -d -v /FOLDERTOSHARE:/data --restart unless-stopped --name polisen-events-downloader-instance polisen-events-downloader`
2. If needed you can access Docker:
`docker exec -it polisen-events-downloader bash`

# Implementation
Both of solutions are working in Docker containers, this allows them to work in parallel in the same server. They are low in CPU consumption, but e.g. polisen-events-share-dat takes at the moment around 250mb of memory and polisen-events-downloader consumer around 250mb of traffic per day for downloading data (plus take into account sharing of data). But it works fine in simple cloud server with 512mb of memory and 1 CPU, just remember to create a swap partition for such a small server

Information is spreaded using Dat protocol (https://datproject.org/). Dat was chosen over other alternatives as it allows easily to sync data that changes often, which is suitable for transfering events related data. Dat is also quite mature project if we are talking about end-user ready software like e.g. browser

# Demo
The demo result can be checked here: [dat://16312ca34361cdf2479fa28ca3302b6815147d8973dbf4bcfa8381445e17b59e/](dat://16312ca34361cdf2479fa28ca3302b6815147d8973dbf4bcfa8381445e17b59e/)

# Known issues
Docker, MacOS and dat do not handle properly file change event, because Docker does not work properly with notifying MacOS about changes in files that happened in shared volume from guest to host machine. Thus dat sync might not realize that changes happened and not update other resources

# FAQ
### How can I get data from dat:// url?
There are few options:
- Beaker browser (https://beakerbrowser.com/)
- Dat desktop application (https://docs.datproject.org/install, Linux and Mac only)
- Command line tool dat (https://github.com/datproject/dat)

### How can I help sharing this data?
If aforementioned dat URL is up and running, then you do not need to use these repositories, you can just help sharing existing data. Dat protocol has multiple solutions for that

If you are a desktop user:
- Beaker browser (https://beakerbrowser.com/)
- Dat desktop application (https://docs.datproject.org/install, Linux and Mac only)

If you have a server (simple cloud server in DigitalOcean is enough)
- hypercored (https://docs.datproject.org/server)
- dat sync (https://github.com/datproject/dat)

Server solutions are preferred over desktop solutons as they can keep dat up and running 24/7