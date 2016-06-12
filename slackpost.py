#Slack Post
import sys
def main():
  argv = sys.argv
  argc = len(argv)
  if (argc != 5):
    print 'Usage: python filename.py channel_name message filename name'
    quit()
  channel_name = argv[1]
  message = argv[2]
  filename = argv[3]
  name = argv[4] 
  slackpost(channel_name, message, filename, name)
  print "finished"

def slackpost(channel_name, message, filename, name):
  from slacker import Slacker
  token = "xoxp-18655778407-18656420960-34494865893-3a3de03c43"
  slacker = Slacker(token)
  result = slacker.files.upload(filename, content=[message], channels=[channel_name])
  slacker.chat.post_message("#"+channel_name, message, username=name)

if __name__ == '__main__':
  main()



