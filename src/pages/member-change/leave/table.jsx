import React, { useState, useEffect } from 'react';
import { DatePicker, Input, Button } from 'antd';
import dayjs from 'dayjs';
import SafeFetch from '../../../utils/safe-fetch.utils';
import SendRequest from '../../../utils/auth-service.utils';
import WithTimeout from '../../../utils/with-timeout.utils';
import UID from '../../../utils/uid.utils';
import Loading from '../../../components/loading';
import {
	TableContainer,
	TableTitle,
	OrderCard,
	OrderHeader,
	OrderBody,
	TableRow,
	Col,
	ChevronIcon,
	EmptyMessage,
} from './table.styled';

const formatTime = (time) => (time ? dayjs(time).format('YYYY-MM-DD') : 'N/A');

const getContractInfo = (contract) => {
	if (!contract || !contract.contract)
		return { contractName: '未知', serverStartAt: 'N/A', serverEndAt: 'N/A' };

	let orderProducts;
	if ('values' in contract && contract.values && 'orderProducts' in contract.values)
		orderProducts = contract.values.orderProducts;
	else orderProducts = [];

	if (orderProducts.length === 0) return [];

	const filterProjectPlans = orderProducts.filter((p) => p.product_id.startsWith('ProjectPlan'));
	if (filterProjectPlans.length === 0)
		return {
			contractName: contract.contract.name,
			contractStartAt: contract.started_at,
			contractAgreedAt: contract.agreed_at,
			serverEndAt: 'N/A',
		};
	// 按 `ended_at` 進行時間排序
	const sortedPlans = filterProjectPlans.sort(
		(a, b) => new Date(a.ended_at) - new Date(b.ended_at)
	);
	return {
		contractName: contract.contract.name,
		contractStartAt: contract.started_at,
		serverEndAt: sortedPlans[0].ended_at,
		contractAgreedAt: contract.agreed_at,
	};
};
const sortDataBycreatAt = (data) => {
	return data.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
};

const LeaveInfo = ({
	contractKey,
	origionData,
	data = {},
	brand,
	isNew,
	setData,
	loading,
	setLoading,
}) => {
	const [value, setValue] = useState({
		startedAt: dayjs(data.started_at) || dayjs(),
		endedAt: dayjs(data.ended_at) || dayjs(),
		reason: data.reason || '',
	});

	const handleChange = (name, newValue) => {
		setValue((prev) => ({
			...prev,
			[name]: newValue,
		}));
	};

	const sendNewLeave = async () => {
		if (loading) return alert('Be more patient! please wait a moment.');

		if (!value.startedAt || !value.endedAt || !value.reason.trim()) return;
		setLoading(true);
		const contract = origionData.contracts.find((contract) => contract.id === contractKey);
		const sendLeaveData = {
			id: isNew ? `${UID()}` : data.id,
			member_id: isNew ? contract.member_id : data.member_id,
			name: isNew ? contract.member.name : data.name,
			contract_id: contractKey,
			category: 'leave',
			started_at: dayjs(value.startedAt).format('YYYY-MM-DD'),
			ended_at: dayjs(value.endedAt).format('YYYY-MM-DD'),
			reason: value.reason,
			record_at: new Date().toISOString(),
			create_by: JSON.parse(localStorage.getItem('memberApp')).email,
			days: null,
			state: isNew ? null : data.state,
		};
		console.log(sendLeaveData);

		try {
			const result = await WithTimeout(
				SafeFetch(
					() =>
						SendRequest({
							do: 'leave-change',
							brand: brand,
							variables: JSON.stringify(sendLeaveData),
							leave_excel_id: contract.leave_excel_id,
							staffMail: JSON.parse(localStorage.getItem('memberApp')).email,
						}),
					'Leave failed'
				),
				30000
			);
			if (!result.success) throw new Error('變更失敗');
		} catch (error) {
			console.error('請假變更失敗:', error);
		}
		try {
			console.log('重整資料中...');
			const leave = await SafeFetch(
				() =>
					SendRequest({
						do: 'search',
						category: 'leave',
						mail: contract.member.email,
						brand: brand,
						staffMail: JSON.parse(localStorage.getItem('memberApp')).email,
					}),
				'Leave failed'
			);
			if (!leave.success) throw new Error('查詢失敗');
			setData(leave.data);
		} catch (error) {
			console.error('查詢失敗:', error);
		}
		setLoading(false);
	};

	const changeLeaveState = async () => {
		if (loading) return alert('Be more patient! please wait a moment.');
		const contract = origionData.contracts.find((contract) => contract.id === contractKey);
		const checkState = (state) => {
			if (state === 'SUCCESS') return 'DELETED';
			if (state === 'DELETED') return 'SUCCESS';
		};
		setLoading(true);
		const targetLeave = data;
		const newLeaveData = { ...targetLeave, state: checkState(targetLeave.state) };

		console.log(newLeaveData);

		try {
			const sendData = {
				do: 'leave-change',
				brand: brand,
				variables: JSON.stringify(newLeaveData),
				leave_excel_id: contract.leave_excel_id,
				staffMail: JSON.parse(localStorage.getItem('memberApp')).email,
			};
			const result = await WithTimeout(
				SafeFetch(() => SendRequest(sendData), 'Leave failed'),
				30000
			);
			if (!result.success) throw new Error('變更失敗');
		} catch (error) {
			console.error('請假變更失敗:', error);
		}
		try {
			console.log('重整資料中...');
			const leave = await SafeFetch(
				() =>
					SendRequest({
						do: 'search',
						category: 'leave',
						mail: contract.member.email,
						brand: brand,
						staffMail: JSON.parse(localStorage.getItem('memberApp')).email,
					}),
				'Leave failed'
			);
			if (!leave.success) throw new Error('查詢失敗');
			setData(leave.data);
		} catch (error) {
			console.error('查詢失敗:', error);
		}
		setLoading(false);
	};

	const HelpLoading = ({ loading, text }) => {
		return loading ? <Loading /> : text;
	};

	const HandlerDiable = (data) => {
		if (!data.state) return false;
		if (data.state === 'DELETED') return true;
		if (data.state === 'SUCCESS') return false;
	};
	const diffDays = value.endedAt.diff(value.startedAt, 'day');
	return (
		<TableRow>
			<Col
				style={{
					flexDirection: 'column',
					display: 'flex',
					gap: '5px',
					justifyContent: 'center',
				}}
			>
				{isNew && '起始日期'}
				<DatePicker
					value={value.startedAt}
					onChange={(date) => handleChange('startedAt', date)}
					format="YYYY-MM-DD"
					disabled={HandlerDiable(data)}
				/>
			</Col>
			<Col
				style={{
					flexDirection: 'column',
					display: 'flex',
					gap: '5px',
					justifyContent: 'center',
				}}
			>
				{isNew && '結束日期'}

				<DatePicker
					value={value.endedAt}
					onChange={(date) => handleChange('endedAt', date)}
					format="YYYY-MM-DD"
					disabled={HandlerDiable(data)}
				/>
			</Col>
			<Col
				style={{
					flexDirection: 'column',
					display: 'flex',
					gap: '5px',
					justifyContent: 'center',
				}}
			>
				{isNew && '事由'}
				<Input
					name="reason"
					value={value.reason}
					onChange={(e) => handleChange('reason', e.target.value)}
					disabled={HandlerDiable(data)}
				/>
			</Col>
			<Col
				style={
					isNew
						? {
								alignItems: 'end',
								display: 'flex',
								gap: '5px',
								justifyContent: 'center',
								flex: '0.5',
						  }
						: {
								alignItems: 'center',
								display: 'flex',
								gap: '5px',
								justifyContent: 'center',
								flex: '0.5',
						  }
				}
			>
				<span>{diffDays + 1}</span>天
			</Col>
			<Col
				style={{ alignSelf: 'end', display: 'flex', gap: '5px', justifyContent: 'center' }}
			>
				<Button
					type="primary"
					onClick={sendNewLeave}
					disabled={HandlerDiable(data)}
				>
					{isNew ? (
						<HelpLoading
							loading={loading}
							text="送出"
						/>
					) : (
						<HelpLoading
							loading={loading}
							text="修改"
						/>
					)}
				</Button>
				{!isNew && (
					<Button onClick={changeLeaveState}>
						{HandlerDiable(data) ? (
							<HelpLoading
								loading={loading}
								text="恢復"
							/>
						) : (
							<HelpLoading
								loading={loading}
								text="刪除"
							/>
						)}
					</Button>
				)}
			</Col>
		</TableRow>
	);
};

const RenderTable = ({ brand, data, setData, collapsedItems, toggleCollapse }) => {
	const { contracts = [] } = data;
	const [loading, setLoading] = useState(false);

	return (
		<TableContainer>
			{contracts.length === 0 ? (
				<EmptyMessage>沒有相關數據</EmptyMessage>
			) : (
				sortDataBycreatAt(contracts).map((contract) => {
					const contractKey = contract.id;
					const {
						contractName = '未知',
						contractStartAt = 'N/A',
						contractAgreedAt = 'N/A',
						serverEndAt = 'N/A',
					} = getContractInfo(contract);
					const agreed_at = formatTime(contractAgreedAt);
					const leaveData = (contract.leave_log || []).filter(
						(leave) => leave.category === 'leave'
					);

					return (
						<OrderCard key={contractKey}>
							<OrderHeader onClick={() => toggleCollapse(contractKey)}>
								<span>合約編號：{contractKey}</span>
								<span>建立時間：{agreed_at}</span>
								<ChevronIcon $collapse={collapsedItems[contractKey]}>▼</ChevronIcon>
							</OrderHeader>
							<OrderBody $collapse={collapsedItems[contractKey]}>
								{leaveData.length === 0 ? (
									<EmptyMessage>沒有相關數據</EmptyMessage>
								) : (
									leaveData.map((leave) => (
										<LeaveInfo
											key={leave.id}
											contractKey={contractKey}
											origionData={data}
											data={leave}
											brand={brand}
											isNew={false}
											setData={setData}
											loading={loading}
											setLoading={setLoading}
										/>
									))
								)}
								<hr />
								<LeaveInfo
									contractKey={contractKey}
									origionData={data}
									isNew={true}
									brand={brand}
									setData={setData}
									loading={loading}
									setLoading={setLoading}
								/>
								<hr />
								<TableRow>
									<Col>{contractName}</Col>
									<Col>{formatTime(contractStartAt)}</Col>
									<Col>{formatTime(serverEndAt)}</Col>
								</TableRow>
							</OrderBody>
						</OrderCard>
					);
				})
			)}
		</TableContainer>
	);
};

function Table({ formField, title, type, data, setData }) {
	const [collapsedItems, setCollapsedItems] = useState({});
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (data && Array.isArray(data)) {
			const initialCollapsedState = {};
			data.forEach((item) => {
				const key = item.id;
				initialCollapsedState[key] = true; // 預設為收起
			});
			setCollapsedItems(initialCollapsedState);
		}
	}, [data]);

	const toggleCollapse = (key) => {
		setCollapsedItems((prev) => ({
			...prev,
			[key]: !prev[key],
		}));
	};
	const handleRestData = async () => {
		setLoading(true);
		try {
			const result = await SafeFetch(
				() =>
					SendRequest({
						do: 'search',
						category: 'leave',
						mail: formField.email,
						brand: formField.brand,
						staffMail: JSON.parse(localStorage.getItem('memberApp')).email,
					}),
				'Leave failed'
			);
			if (!result.success) throw new Error('查詢失敗');
			setData(result.data);
			setLoading(false);
		} catch (error) {
			console.error('請假變更失敗:', error);
		}
	};
	return (
		<TableContainer>
			<TableTitle>
				{title}面板{' '}
				<Button onClick={handleRestData}>{loading ? <Loading /> : '重新整理'}</Button>
			</TableTitle>
			<RenderTable
				brand={formField.brand}
				data={data}
				setData={setData}
				collapsedItems={collapsedItems}
				toggleCollapse={toggleCollapse}
			/>
		</TableContainer>
	);
}

export default Table;
