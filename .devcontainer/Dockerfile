FROM alpine:3.11

ARG USER_UID=1000
ARG USER_NAME=dev

ARG COMMITIZEN_VER=4.0.3
ARG CZ_EMOJI_VER=1.1.2
ARG NODE_VER=12.15.0-r1
ARG YARN_VER=1.19.2-r0

RUN apk update && \
  apk add git && \
  rm -rf /var/cache/apk/*

RUN apk update && \
  apk add git bash nodejs=${NODE_VER} yarn=${YARN_VER} sudo openssh npm && \
  rm -rf /var/cache/apk/*

RUN yarn global add commitizen@${COMMITIZEN_VER} cz-emoji@${CZ_EMOJI_VER}

RUN adduser -D -u ${USER_UID} -s /bin/bash ${USER_NAME} && \
  echo "${USER_NAME} ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers
RUN echo '{ "path": "cz-emoji" }' > /home/${USER_NAME}/.czrc && chown ${USER_NAME} /home/${USER_NAME}/.czrc