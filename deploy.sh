dir=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )
# dest=$(/Users/itay/dev/website/backand/apps)
printf "Copy fiels into backand website\n"
cp -a $dir/build/dist/assets/js/* /Users/itay/dev/website/backand/apps/assets/js/
cp -a $dir/build/dist/assets/css/* /Users/itay/dev/website/backand/apps/assets/css/
# cp -aR $dir/build/dist/assets/images/* /Users/itay/dev/website/backand/apps/assets/images/

cp $dir/build/dist/app.js /Users/itay/dev/website/backand/apps/
cp $dir/build/dist/index.html /Users/itay/dev/website/backand/apps/
