import React, { createContext, useEffect, useState } from 'react';

export const AuthContext = createContext({});

const defaultUser = {
	name: '',
	mail: '',
	router: [],
	login_at: '',
};

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(defaultUser);

	const login = (userData) => {
		localStorage.setItem('memberApp', JSON.stringify(userData));
		setUser(userData);
	};
	const logout = () => {
		localStorage.removeItem('memberApp');
		setUser(defaultUser);
	};

	useEffect(() => {
		const getLocalStorage = JSON.parse(localStorage.getItem('memberApp'));
		if (getLocalStorage !== null) setUser(JSON.parse(localStorage.getItem('memberApp')));
	}, []);

	const value = { user, setUser, login, logout };

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
