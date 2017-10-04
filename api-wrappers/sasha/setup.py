from setuptools import setup

setup(
   name='PySasha',
   version='0.1',
   description='Wrapper for Sasha\'s http api.',
   author='Ben Wiz',
   author_email='bwisialowski@gmail.com',
   packages=['PySasha'],  # Same as name
   install_requires=['requests'],  # External packages as dependencies
   scripts=[]
)
