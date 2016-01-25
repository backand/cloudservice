## Reporting issues

1. Feel free to report any issue or proposal.

## Pull requests

1. Fork it
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Test your changes to the best of your ability.
4. Update the documentation to reflect your changes if they add or changes current functionality.
5. Commit your changes (`git commit -am 'Added some feature'`)
6. Push to the branch (`git push origin my-new-feature`)
7. Create new Pull Request

## New Release
1. Update app.js with the new version
2. Tag the commit: git tag -a 1.6.1 -m "Release version 1.6.1"
3. Push to GitHub: git push origin master --tags. To delete existing tag git tag -d 1.6.1 and clear bower cache.
4. Run gulp serve:dist
5. Deploy