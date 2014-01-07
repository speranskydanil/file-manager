FileManager::Application.routes.draw do
  get '/base_dir', to: 'application#base_dir'

  get  '/list/:dir',          to: 'application#list',     :constraints => { :dir => /[^\/]+/ }
  get  '/read/:file',         to: 'application#read',     :constraints => { :file => /[^\/]+/ }
  post '/move/:from/:to',     to: 'application#move',     :constraints => { :from => /[^\/]+/, :to => /[^\/]+/ }
  post '/copy/:from/:to',     to: 'application#copy',     :constraints => { :from => /[^\/]+/, :to => /[^\/]+/ }
  post '/remove/:path',       to: 'application#remove',   :constraints => { :path => /[^\/]+/ }
  post '/rename/:path/:name', to: 'application#rename',   :constraints => { :path => /[^\/]+/, :name => /[^\/]+/ }
  post '/zip/:path/:name',    to: 'application#zip',      :constraints => { :path => /[^\/]+/, :name => /[^\/]+/ }
  post '/unzip/:file/:name',  to: 'application#unzip',    :constraints => { :file => /[^\/]+/, :name => /[^\/]+/ }
  get  '/download/:file',     to: 'application#download', :constraints => { :file => /[^\/]+/ }

  post '/mkdir/:path',        to: 'application#mkdir',    :constraints => { :path => /[^\/]+/ }

  root 'application#root'
end

