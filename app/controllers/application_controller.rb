require 'pathname'
require 'fileutils'
require 'filemagic'
require 'shellwords'

def type pathname
  FileMagic.new(FileMagic::MAGIC_MIME).file(pathname.to_s)
end

def size pathname
  size = File.new(pathname).stat.size

  kilo_size = 1024
  mega_size = 1024 ** 2
  giga_size = 1024 ** 3

  case size
  when (0..kilo_size)
    "#{(size.to_f).round(2)} B"
  when (kilo_size..mega_size)
    "#{(size.to_f / kilo_size).round(2)} KB"
  when (mega_size..giga_size)
    "#{(size.to_f / mega_size).round(2)} MB"
  else
    "#{(size.to_f / giga_size).round(2)} GB"
  end
end

def stat pathname
  s = File.new(pathname).stat

  {
    path: pathname.to_s,
    name: pathname.basename.to_s,
    type: type(pathname),
    size: size(pathname),
    bsize: s.size,
    mode: s.mode.to_s(8),
    ctime: s.ctime.strftime('%y-%m-%d %H:%M %Z').downcase
  }
end


class ApplicationController < ActionController::Base
  http_basic_authenticate_with name: CONFIG['login'], password: CONFIG['password']

  def root
    render :file => 'layouts/application', :layout => false
  end

  def base_dir
    render text: CONFIG['base_dir']
  end

  before_filter(:only => %i(list read move copy remove rename zip unzip download mkdir)) do
    params.select do |k, _|
      %w(dir file from to path).include? k
    end.each do |_, v|
      raise 'access denied' unless v.start_with? CONFIG['base_dir']
    end
  end

  def list
    dir = Pathname(params[:dir])
    raise 'type error' unless dir.directory?

    render json: Dir.entries(dir).reject { |e| %w{ . .. }.include? e }.map { |e| stat(dir + e) }
  end

  def read
    file = Pathname(params[:file])
    raise 'type error' unless file.file?

    if type(file) =~ /text/
      render :text => File.open(file, 'r').read
    else
      send_file file
    end
  end

  def move
    from = Pathname(params[:from])
    raise 'type error' unless from.exist?

    to = Pathname(params[:to])

    FileUtils.mv from, to

    render :nothing => true
  end

  def copy
    from = Pathname(params[:from])
    raise 'type error' unless from.exist?

    to = Pathname(params[:to])

    FileUtils.cp_r from, to

    render :nothing => true
  end

  def remove
    path = Pathname(params[:path])
    raise 'type error' unless path.exist?

    FileUtils.rm_r path

    render :nothing => true
  end

  def rename
    path = Pathname(params[:path])
    raise 'type error' unless path.exist?

    name = params[:name]

    FileUtils.mv path, path.dirname + name

    render :nothing => true
  end

  def zip
    path = Pathname.new(params[:path])
    raise 'type error' unless path.exist?

    name = params[:name]

    dirname = Shellwords.escape(path.dirname)
    basename = Shellwords.escape(path.basename)

    name = Shellwords.escape(name)

    command = Thread.new do
      system("cd #{dirname}; zip -r #{name}.zip #{basename}")
    end

    command.join

    render :nothing => true
  end

  def unzip
    file = Pathname.new(params[:file])
    raise 'type error' unless file.file?

    name = params[:name]

    dirname = Shellwords.escape(file.dirname)
    basename = Shellwords.escape(file.basename)

    name = Shellwords.escape(name)

    command = Thread.new do
      system("cd #{dirname}; unzip #{basename} -d #{name}")
    end

    command.join

    render :nothing => true
  end

  def download
    file = Pathname.new(params[:file])
    raise 'type error' unless file.file?

    send_file file
  end

  def mkdir
    FileUtils.mkdir params[:path]
  end
end

