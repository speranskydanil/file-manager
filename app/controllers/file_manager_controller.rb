require 'fileutils'
require 'shellwords'

require Rails.root + 'lib/util'

class FileManagerController < ApplicationController
  before_filter(except: :base_dir) do
    params.select do |k, _|
      %w(dir file from to path).include? k
    end.each do |_, v|
      raise 'access denied' unless v.start_with? CONFIG['base_dir']
    end
  end

  def base_dir
    render text: CONFIG['base_dir']
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
      render text: File.open(file, 'r').read
    else
      send_file file
    end
  end

  def move
    from = Pathname(params[:from])
    raise 'type error' unless from.exist?

    to = Pathname(params[:to])

    FileUtils.mv from, to

    render nothing: true
  end

  def copy
    from = Pathname(params[:from])
    raise 'type error' unless from.exist?

    to = Pathname(params[:to])

    FileUtils.cp_r from, to

    render nothing: true
  end

  def remove
    path = Pathname(params[:path])
    raise 'type error' unless path.exist?

    FileUtils.rm_r path

    render nothing: true
  end

  def rename
    path = Pathname(params[:path])
    raise 'type error' unless path.exist?

    name = params[:name]

    FileUtils.mv path, path.dirname + name

    render nothing: true
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

    render nothing: true
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

    render nothing: true
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

