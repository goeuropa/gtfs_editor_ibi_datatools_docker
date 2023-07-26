#FROM centos:7

#RUN yum -y --setopt=tsflags=nodocs update && \
#    yum -y --setopt=tsflags=nodocs install epel-release && \
#    yum -y --setopt=tsflags=nodocs install nginx && \
#    yum clean all

#COPY ./proxy.conf /etc/nginx/nginx.conf


#EXPOSE 8081

# Start nginx and tail its log
#CMD nginx && echo "Nginx started" && tail -F /var/log/nginx/access.log

FROM jitesoft/lighttpd:latest

EXPOSE 8089
#ssl
# Copy your SSL certificate and key
COPY config/cert.pem /etc/lighttpd/ssl.crt
COPY config/privkey.pem /etc/lighttpd/ssl.key

# Configure lighttpd for HTTPS
RUN echo 'server.modules += ("mod_openssl")' >> /etc/lighttpd/lighttpd.conf
RUN echo 'ssl.engine = "enable"' >> /etc/lighttpd/lighttpd.conf
RUN echo 'ssl.pemfile = "/etc/lighttpd/ssl.crt"' >> /etc/lighttpd/lighttpd.conf
RUN echo 'ssl.privkey = "/etc/lighttpd/ssl.key"' >> /etc/lighttpd/lighttpd.conf


RUN mkdir -p /var/www/html/dist

COPY --from=build /opt/datatools-ui/index.html /var/www/html/
COPY --from=build /opt/datatools-ui/dist /var/www/html/dist
COPY /lighthttp/rewrite.conf /etc/lighttpd/conf.d/

