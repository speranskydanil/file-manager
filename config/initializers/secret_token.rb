# Be sure to restart your server when you modify this file.

# Your secret key is used for verifying the integrity of signed cookies.
# If you change this key, all old signed cookies will become invalid!

# Make sure the secret is at least 30 characters and all random,
# no regular words or you'll be exposed to dictionary attacks.
# You can use `rake secret` to generate a secure secret key.

# Make sure your secret_key_base is kept private
# if you're sharing your code publicly.
FileManager::Application.config.secret_key_base = '5fd80b9628d0b3cb6ced9295bdcec35f35d53f615ee3edc85d5c604099f73e43d416766051aecb05da0d5875135153d088400e2c5cbeb4bdf99a603616b32720'
