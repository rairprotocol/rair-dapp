FROM atlassian/default-image:3
WORKDIR /.
COPY /. /rair
RUN ./rair/commands/bitbucket-pipelines/pipeline-docker-build/docker_install.sh
ENTRYPOINT [ "/bin/bash", "-l"]