api_dev:
	cd api && cargo run

api_prod:
	cd api && cargo run --release

web_dev:
	cd web && (yarn dev || (yarn && yarn dev))

web_prod:
	cd web && yarn && yarn build && yarn start
