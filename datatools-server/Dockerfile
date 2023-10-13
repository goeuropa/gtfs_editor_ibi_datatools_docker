FROM maven:3.6.3-openjdk-11

ENV VERSION=v5.0.0

#dev version of datatools-server since we use working versions
#ENV GIT_COMMIT=2a725e9f8a0c1906cbcdbacfd02c57da515b014d

ENV GIT_BRANCH=rozklady
#ENV GIT_BRANCH=dev
#ENV GIT_BRANCH=35180d62e0d3d2efb7c54b2030cddf282e44dfdb polaczenie do bazy
ENV JAR_NAME=dt.jar
#ENV JAR_NAME=datatools-server.jar

RUN apt-get update
RUN apt-get install -y --no-install-recommends git


RUN mvn -v

ADD "https://www.random.org/cgi-bin/randbyte?nbytes=10&format=h" skipcache
RUN  git clone https://github.com/goeuropa/datatools-server.git /opt/datatools-server
#RUN git clone https://github.com/ibi-group/datatools-server.git /opt/datatools-server

WORKDIR /opt/datatools-server

#current synchronised branch
RUN git checkout $GIT_BRANCH

VOLUME /root/.m2

COPY /lib/gtfs-lib-a3e5707.jar /opt/gtfs-lib-a3e5707.jar
#RUN mvn install:install-file -Dfile=/opt/gtfs-lib-a3e5707.jar -DgroupId=com.github.conveyal -DartifactId=gtfs-lib -Dversion=a3e5707 -Dpackaging=jar

RUN mvn package -Dmaven.test.skip=true -Djar.finalName=my-app

ADD ./config/* /config/

COPY /config/env.yml /opt/datatools-server/configurations/default/env.yml
COPY /config/server.yml /opt/datatools-server/configurations/default/server.yml
COPY /config/auth.pem /opt/datatools-server/configurations/auth.pem
#RUN mv target/dt*.jar target/datatools-server.jar



EXPOSE 4000

CMD java -jar "target/$JAR_NAME"

