class ApplicationController < ActionController::Base
  http_basic_authenticate_with name: CONFIG['login'], password: CONFIG['password']

  def root
    render file: 'layouts/application', layout: false
  end
end

