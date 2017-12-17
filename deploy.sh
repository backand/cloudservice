dir=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )
# dest=$(/Users/itay/dev/website/backand/apps)
printf "Build Prod folder\n"
gulp prod:dist

printf "Copy fiels into backand website\n"
cp -a $dir/build/dist/* /Users/itay/dev/website/backand/apps/
# cp -aR $dir/build/dist/assets/images/* /Users/itay/dev/website/backand/apps/assets/images/

#cp $dir/build/dist/app.js /Users/itay/dev/website/backand/apps/
#cp $dir/build/dist/index.html /Users/itay/dev/website/backand/apps/
