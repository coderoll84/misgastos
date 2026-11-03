FROM registry.access.redhat.com/ubi9/nodejs-22-minimal

WORKDIR /opt/app-root/src

# OpenShift ejecuta con un UID aleatorio del grupo 0, por eso el grupo root es dueño de los archivos
COPY --chown=1001:0 package*.json ./
RUN npm install --omit=dev

COPY --chown=1001:0 server.js ./
COPY --chown=1001:0 public ./public

ENV PORT=8080
EXPOSE 8080

USER 1001

CMD ["node", "server.js"]
