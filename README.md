docker build -t polisen-events-downloader .

docker run -d -v /FOLDERTOSHARE:/data --name polisen-events-downloader-instance polisen-events-downloader

To access docker:
docker exec -it polisen-events-downloader bash