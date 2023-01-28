class GenShinWishAnalysis {
	constructor(url) {
		this.url_props = url.split('?')[1].replace('#/log', '');
		this.url =
			'https://hk4e-api.mihoyo.com/event/gacha_info/api/getGachaLog?' +
			this.url_props;
		this.page = '1';
		this.size = '20';
		this.data = [];
		this.type = ['UP', '常驻', '武器', '新手'];	// 抽卡类型
	}

	/**
	 * 获取抽卡记录类型
	 * @param type	抽卡类型 (UP, 常驻, 武器, 新手)
	 */
	getType(type) {
		const type_map = {
			UP: '301',
			常驻: '200',
			武器: '302',
			新手: '100',
		};
		return '&gacha_type=' + type_map[type];
	}

	/**
	 * 获取抽卡记录页数
	 * @param id	抽卡记录结尾id
	 * @param page	抽卡记录页数 (默认1)
	 * @param size	抽卡记录每页数量 (默认20)
	 */
	getPageNum(id, page = this.page, size = this.size) {
		return '&page=' + page + '&size=' + size + '&end_id=' + id;
	}

	sleep(time) {
		return new Promise(resolve => setTimeout(resolve, time));
	}

	/**
	 * 获取抽卡记录
	 * @param type	抽卡类型 (UP, 常驻, 武器, 新手)
	 * @returns {Promise<{}>}
	 */
	async getLog(type) {
		this.data = [];
		let end_id = 0;
		while (1) {
			const res = await fetch(
				this.url + this.getType(type) + this.getPageNum(end_id),
			);
			const data = await res.json();
			for (const list_key in data.data.list) {
				const list = data.data.list[list_key];
				this.data.push({
					name: list.name,
					rank_type: list.rank_type,
					time: list.time,
				});
				end_id = list.id;
			}
			if (data.data.list.length < 20) {
				break;
			}
			await this.sleep(1000);
		}
		return this.data;
	}

	/**
	 * 分析抽卡记录
	 * 将获取3,4,5星的数量,及各个五星的抽数
	 * @param data	抽卡记录
	 * @returns {Promise<{rank_total: {5: number, 4: number, 3: number}, rank5_count: [{name: string, count: number, time: string}], total: number}>}
	 */
	async analysisData(data = this.data) {
		let ret = {
			total: data.length,
			rank_total: {
				5: 0,
				4: 0,
				3: 0,
			},
			rank5_count: []
		};

		let count = 0;
		for (const data_key in data) {
			count++;
			const data_item = data[data_key];
			if (data_item.rank_type === '5') {
				ret.rank_total['5']++;
				ret.rank5_count.push({
					name: data_item.name,
					count: count,
					time: data_item.time,
				});
				count = 0;
			} else if (data_item.rank_type === '4') {
				ret.rank_total['4']++;
			} else if (data_item.rank_type === '3') {
				ret.rank_total['3']++;
			}
		}
		return ret;
	}
}

export default GenShinWishAnalysis;
