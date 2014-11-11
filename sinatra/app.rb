require 'sinatra'
require 'sinatra/activerecord'
require 'sinatra/json'
require 'pry'

ActiveRecord::Base.establish_connection(
  :adapter  => "mysql2",
  :host     => "ec2-54-213-216-43.us-west-2.compute.amazonaws.com",
  :username => "ec2-user",
  :password => "Homa2013",
  :database => "mydb"
)

set :server , %w[thin]

class News < ActiveRecord::Base
end

get '/' do
  @news = News.order("updated_ts desc").limit(1)
  erb :index
end

get '/search' do
  erb :search
end

get '/tag' do
  erb :tag
end

get '/:id' do
  @news = News.where("id = ?",params[:id]).order("updated_ts desc").first
  json(@news, :encoder => :to_json, :content_type => :js)
end
