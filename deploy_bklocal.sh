dir=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )

printf "Build Localhost folder\n"
gulp local:dist
printf "Deploy to bklocal\n"
backand sync --app bklocal --master 2021e4b3-50e1-4e24-8ff0-f512e13b6e51 --user ff46366b-840f-11e6-8eff-0e00ae4d21e3 --folder $dir/build/dist
