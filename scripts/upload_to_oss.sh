# Upload the contents of the local './out/' directory to the OSS bucket named 'zvec-website'.
#
# Prerequisites:
# - ossutil must be installed and properly configured with valid credentials.
# - The OSS endpoint should be set to: https://oss-cn-hongkong.aliyuncs.com

ossutil sync ./out/ oss://zvec-website -f