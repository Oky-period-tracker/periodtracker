# Overview

This is a basic overview of the cloud architecture and deployment.

![Diagram](overview.svg 'Diagram')

1. Build the docker images on your machine `docker-compose build`
2. Tag the docker images `docker tag`
3. Push the images to the registry `docker push`
4. Apply your k8s configuration files to the cluster `kubectl apply`
5. The cluster pulls the docker images from the registry
6. The cluster creates pods from the images, these are running instances of the CMS and API
7. Your DNS record points your domain to the IP address of your cluster
8. The cert-manager pod handles SSL certificates via Let's Encrypt, to allow for requests via https
9. The mobile app / web browser makes https requests
10. The load balancer directs the request to one of the nodes in the cluster
11. The Nginx Ingress determines which requests are routed to which pods. For example, requests to cms.example.com are directed to the CMS pods
12. The pods access the database on the droplet

More detailed step by step instructions are found [here](./deployment.md)
