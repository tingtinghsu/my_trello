Rails.application.routes.draw do
  resources :cards
  resources :lists
  devise_for :users
  root 'lists#index'
end
