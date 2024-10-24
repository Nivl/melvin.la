FROM alpine:latest as builder

RUN apk add -U --no-cache ca-certificates
RUN update-ca-certificates

COPY ./bin/api /app/
RUN ["chmod", "+x", "/app/api"]

FROM scratch

COPY --from=builder /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/
COPY --from=builder /app/api /app/
EXPOSE 80

ENTRYPOINT ["/app/api"]
