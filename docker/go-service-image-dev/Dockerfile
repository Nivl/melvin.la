FROM golang:1.24-alpine

RUN apk update && apk upgrade
RUN apk add curl git gcc musl-dev
# github.com/actions/cache requires a version of tar that supports --posix
# The one installed by default doesn't support it
RUN apk add --no-cache tar

ARG TASK_VERSION=3.44.0
ARG TASK_SHASUM="d6c9c0a14793659766ee0c06f9843452942ae6982a3151c6bbd78959c1682b82  task_linux_amd64.tar.gz"
RUN curl -L -o task_linux_amd64.tar.gz https://github.com/go-task/task/releases/download/v${TASK_VERSION}/task_linux_amd64.tar.gz && \
    tar xvzf task_linux_amd64.tar.gz && \
    echo "$TASK_SHASUM" | sha256sum -c - && \
    mv task /usr/local/bin/task


ARG GOLANG_CI_VERSION=2.2.1
ARG GOLANG_CI_SHASUM="4098436776a4f4bbef25dcad93f56533003d085f9133e4c69ba3145973d211dc  golangci-lint.tar.gz"
RUN curl -L -o golangci-lint.tar.gz https://github.com/golangci/golangci-lint/releases/download/v${GOLANG_CI_VERSION}/golangci-lint-${GOLANG_CI_VERSION}-linux-amd64.tar.gz && \
    tar xvzf golangci-lint.tar.gz --strip-components=1 && \
    echo "$GOLANG_CI_SHASUM" | sha256sum -c - && \
    mv golangci-lint /usr/local/bin/golangci-lint


ARG GOTESTSUM_VERSION=1.12.3
ARG GOTESTSUM_SHASUM="dd644e817b509fa8e216887ec93facdd85722d1b78f6a19149ee1bc9f59fca64  gotestsum.tar.gz"
RUN curl -L -o gotestsum.tar.gz https://github.com/gotestyourself/gotestsum/releases/download/v${GOTESTSUM_VERSION}/gotestsum_${GOTESTSUM_VERSION}_linux_amd64.tar.gz && \
    tar xvzf gotestsum.tar.gz && \
    echo "$GOTESTSUM_SHASUM" | sha256sum -c - && \
    mv gotestsum /usr/local/bin/gotestsum
