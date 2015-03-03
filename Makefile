UNAME := $(shell uname)

app:
	make app_watch -j

app_watch: appserver watcher

snapshot:
	gulp snapshot

test:
	make unit_test
	make build
	make acceptance_test

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

test_watcher:
	npm run-script watcher

unit_test:
	npm test

acceptance_test:
	protractor protractor.js

local_acceptance_test:
	protractor protractor.local.js

documentation:
	rm -rf docs
	./node_modules/jsdoc/jsdoc.js\
	  --configure ./.jsdocrc\
	  --destination docs\
	  --recurse\
	  --private\
	  app/scripts/

.PHONY: app appserver test_watcher watcher test unit_test acceptance_test local_acceptance_tests setup
