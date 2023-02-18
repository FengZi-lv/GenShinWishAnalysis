class GenShinWishAnalysis {
	constructor(url) {
		this.url_props = url.split('?')[1].replace('#/log', '');
		this.url =
			'https://hk4e-api.mihoyo.com/event/gacha_info/api/getGachaLog?' +
			this.url_props;
		this.page = '1';
		this.size = '20';
		this.data = [];
		this.type = ['up_wish', 'comm_wish', 'weapon_wish', 'novice_wish'];
		this.comm_wish_chara = [
			'提纳里',
			'刻晴',
			'莫娜',
			'七七',
			'迪卢克',
			'琴',
			'阿莫斯之弓',
			'天空之翼',
			'四风原典',
			'天空之卷',
			'和璞鸢',
			'天空之脊',
			'狼的末路',
			'天空之傲',
			'天空之刃',
			'风鹰剑',
		]; // 常驻5星物品, 若游戏常驻祈愿更新需注意更新此数组
	}

	/**
	 * 获取抽卡记录类型
	 * @param type	抽卡类型 ('up_wish', 'comm_wish', 'weapon_wish', 'novice_wish')
	 */
	getType(type) {
		const type_map = {
			up_wish: '301',
			comm_wish: '200',
			weapon_wish: '302',
			novice_wish: '100',
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
	 * @param type	抽卡类型 (可查看`GenShinWishAnalysis.type`)('up_wish', 'comm_wish', 'weapon_wish', 'novice_wish')
	 * @param progress_callback 进度回调
	 * @returns {Promise<{}>}
	 */
	async getLog(type, progress_callback = () => {
	}) {
		this.data = [];
		let end_id = 0;
		let counter = 0;
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
			await this.sleep(100);
			progress_callback(counter++);
		}
		return this.data;
	}

	/**
	 * 分析抽卡记录
	 * 将获取3,4,5星的数量,及各个五星的抽数
	 * @param data	抽卡记录
	 * @returns {Promise<{rank_total: {5: number, 4: number, 3: number}, rank5_count: [{name: string, count: number, time: string,is_wai: boolean}], total: number, now_count: number}>}
	 */
	async analysisData(data = this.data) {
		let ret = {
			total: data.length,
			rank_total: {
				5: 0,
				4: 0,
				3: 0,
			},
			rank5_count: [],
			now_count: 0,
		};
		data = data.reverse(); // 反转数组, 使得最新的抽卡记录在最后面, 一遍判断保底
		let count = 0;
		let guaranty = false; // 保底标志 (真为大保底, 假为小保底)
		for (const data_key in data) {
			count++;
			const data_item = data[data_key];
			let _guaranty = '';
			if (data_item.rank_type === '5') {
				if (guaranty) {
					guaranty = false;
					_guaranty = '大保底';
				} else {
					_guaranty = '小保底';
				}
				ret.rank_total['5']++;
				ret.rank5_count.push({
					name: data_item.name,
					count: count,
					rank_type: data_item.rank_type,
					time: data_item.time,
					guarant: _guaranty,
					is_wai: !this.comm_wish_chara.includes(data_item.name),
				});
				guaranty = this.comm_wish_chara.includes(data_item.name);
				count = 0;
			} else if (data_item.rank_type === '4') {
				ret.rank_total['4']++;
			} else if (data_item.rank_type === '3') {
				ret.rank_total['3']++;
			}
		}
		ret.rank5_count = ret.rank5_count.reverse(); // 反转数组, 使得最新的抽卡记录在最前面
		for (const rank5_count_key in ret.rank5_count) {
			const rank5_count_item = ret.rank5_count[rank5_count_key];
			ret.now_count += rank5_count_item.count;
		}
		ret.now_count = ret.total - ret.now_count;
		return ret;
	}
}

export default GenShinWishAnalysis;
