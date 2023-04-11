api_dev:
	cd api && cargo run

api_prod:
	cd api && cargo run --release

web_dev:
	cd web && yarn dev

web_prod:
	cd web && yarn build && yarn start
