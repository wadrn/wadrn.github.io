username = 'wadrn'
new_token = 'afbc6a4afa9c2c95927b1307d63eb923a4dda457'
repo_name = 'github-comments-repo' 
sitemap_url = 'https://wadrn.github.io/sitemap.xml'
kind = 'gitment'

require 'open-uri'
require 'faraday'
require 'active_support'
require 'active_support/core_ext'
require 'sitemap-parser'

sitemap = SitemapParser.new sitemap_url
urls = sitemap.to_a

conn = Faraday.new(:url => "http://api.github.com/repos/#{username}/#{repo_name}/issues") do |conn|
    conn.basic_auth(username,new_token)
    conn.adapter  Faraday.default_adapter
end

urls.each_with_index do |url,index|
    title = open(url).read.scan(/<title(.*?)<\/title>/).first.first.force_encoding('UTF-8')
    response = conn.post do |req|
        req.body = { body:url, labels:[kind,url], title:title }.to_json
    end
    puts response.body
    sleep 15 if index % 20 == 0
end

