FileManager::Application.routes.draw do
  get '/base_dir', to: 'file_manager#base_dir'

  get  '/list/:dir',          to: 'file_manager#list',     constraints: { dir: /[^\/]+/ }
  get  '/read/:file',         to: 'file_manager#read',     constraints: { file: /[^\/]+/ }
  post '/move/:from/:to',     to: 'file_manager#move',     constraints: { from: /[^\/]+/, to: /[^\/]+/ }
  post '/copy/:from/:to',     to: 'file_manager#copy',     constraints: { from: /[^\/]+/, to: /[^\/]+/ }
  post '/remove/:path',       to: 'file_manager#remove',   constraints: { path: /[^\/]+/ }
  post '/rename/:path/:name', to: 'file_manager#rename',   constraints: { path: /[^\/]+/, name: /[^\/]+/ }
  post '/zip/:path/:name',    to: 'file_manager#zip',      constraints: { path: /[^\/]+/, name: /[^\/]+/ }
  post '/unzip/:file/:name',  to: 'file_manager#unzip',    constraints: { file: /[^\/]+/, name: /[^\/]+/ }
  get  '/download/:file',     to: 'file_manager#download', constraints: { file: /[^\/]+/ }

  post '/mkdir/:path',        to: 'file_manager#mkdir',    constraints: { path: /[^\/]+/ }

  root 'application#root'
end

