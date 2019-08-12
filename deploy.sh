#! /bin/sh

npm run build
./icons.sh
scp -rp public flammel@florianlammel.com:/home/flammel/www/foodlog.florianlammel.com/
