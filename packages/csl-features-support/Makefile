# This tmp directory can be very busy.
# Using a pattern (e.g. rm tmp/*.js) can break the shell with a
# 'too many arguments' error. It's better to delete the directory.
# However it must be recreated as it is expected to exist when style format
# are extracted from Cucumber scenarios and converted into Node.js modules.
clean:; rm -rfv tmp && mkdir tmp
