dir=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )

printf "Build blue folder\n"
gulp blue:dist
printf "Deploy to blue\n"
backand sync --app blue --master 229e14c2-9229-4f9e-9908-5bd41d8bddaf --user e6b8e25f-6eb3-4919-a44f-91c95f480cf8 --folder $dir/build/dist