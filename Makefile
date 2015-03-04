UNAME := $(shell uname)

app:
	make app_watch -j

app_watch: appserver watcher

snapshot:
	gulp snapshot

setup:
	npm install
	npm install bower
	./node_modules/bower/bin/bower install --dev

build:
	gulp build

appserver:
	nginx -p . -c config/nginx.conf

watcher:
	gulp watch

documentation:
	rm -rf docs
	./node_modules/jsdoc/jsdoc.js\
	  --configure ./.jsdocrc\
	  --destination docs\
	  --recurse\
	  --private\
	  app/scripts/

.PHONY: app appserver watcher test setup
