mkdir "${HOME}/.npm-packages"
set NPM_PACKAGES="${HOME}/.npm-packages"
echo "prefix=${HOME}/.npm-packages" > $HOME/.npmrc
set NODE_PATH="$NPM_PACKAGES/lib/node_modules:$NODE_PATH"

PATH="$NPM_PACKAGES/bin:$PATH"
# Unset manpath so we can inherit from /etc/manpath via the `manpath`
# command
unset MANPATH # delete if you already modified MANPATH elsewhere in your config
MANPATH="$NPM_PACKAGES/share/man:$(manpath)"
source ~/.bashrc

sudo nohup node server/server.js 91 &
sudo nohup node server/server.js 92 &
sudo nohup node server/server.js 93 &
sudo nohup node server/server.js 94 &

exit

