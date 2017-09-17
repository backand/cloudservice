dir=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )

printf "Build QA folder\n"
gulp qa:dist

printf "Deploy to qa1\n"
backand sync --app qa1 --master 9b37748c-0646-40da-9100-59a86d4c7da4 --user d94c5b9e-9f2a-11e5-be83-0ed7053426cb --folder $dir/build/dist
