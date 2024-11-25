FROM denoland/deno

EXPOSE 8000

WORKDIR /app

ADD . /app

RUN deno install --entrypoint main.ts

# Not sure if permissions need set here
CMD ["run", "main.ts"]