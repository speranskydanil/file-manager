require 'pathname'
require 'filemagic'

def type pathname
  magic = FileMagic.new(FileMagic::MAGIC_MIME)
  result = magic.file(pathname.to_s)
  magic.close
  result
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
    size: pathname.directory? ? "#{pathname.entries.size - 2} objects" : size(pathname),
    bsize: s.size,
    mode: s.mode.to_s(8),
    ctime: s.ctime.strftime('%y-%m-%d %H:%M %Z').downcase
  }
end

