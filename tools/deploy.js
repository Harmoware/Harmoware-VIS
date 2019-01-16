const {gitDescribe, gitDescribeSync} = require('git-describe');
const gitInfo = gitDescribeSync();
const version = gitInfo.tag.substr(1);
