import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface NetInfo {
	ip: string;
	city: string;
	region: string;
	country_name: string;
	postal: string;
	latitude: number;
	longitude: number;
	asn: string;
	org: string;
	timezone: string;
}

export const App = () => {
	const [netInfo, setNetInfo] = useState<NetInfo | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({
		location: true,
		network: true,
		other: true,
	});

	useEffect(() => {
		const fetchNetData = () => {
			fetch("https://ipapi.co/json/")
				.then((response) => response.json())
				.then((data) => {
					setNetInfo(data);
				})
				.catch(() => {
					setError("You have reached the limit of requests :(");
				})
				.finally(() => {
					setTimeout(() => {
						setLoading(false);
					}, 2350);
				});
		};
		fetchNetData();
	}, []);

	const toggleSection = (section: string) => {
		setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
	};

	if (loading)
		return (
			<div className="flex text-center justify-center items-center min-h-screen">
				<img src="/contents/loader.gif" />
			</div>
		);
	if (error)
		return (
			<div className="flex text-center justify-center font-black text-2xl items-center min-h-screen text-red-400">
				{error}
			</div>
		);
	if (!netInfo) return <div className="text-center text-gray-100">No IP information available</div>;

	return (
		<div className="min-h-screen flex items-center justify-center p-4">
			<motion.div
				initial={{ opacity: 0, y: -50 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className="bg-black/10 rounded-lg shadow-lg p-6 w-full max-w-md"
			>
				<h1 className="inline-flex items-center justify-start w-full gap-x-2 text-4xl font-black mb-6 text-center max-md:flex-col">
					<img src="/contents/logo.webp" width={60} height={60} className="shadow-lg" />
					NETSCOPE
					<p className="text-sm font-medium text-center">
					by
					<a
						href="https://www.linkedin.com/in/fedetomassini/"
						target="_blank"
						rel="noopener noreferrer"
						className="text-blue-400 hover:underline ml-1"
					>
						fedetomassini
					</a>
				</p>
				</h1>
				<div className="space-y-4">
					{["location", "network", "other"].map((section) => (
						<motion.div key={section} layout>
							<motion.button
								className="w-full flex justify-between items-center py-2 px-4 bg-gray-800/35 rounded-lg text-gray-100"
								onClick={() => toggleSection(section)}
								whileHover={{ scale: 1.02 }}
								whileTap={{ scale: 0.98 }}
							>
								<span className="font-semibold">{section.charAt(0).toUpperCase() + section.slice(1)} Information</span>
								<motion.div animate={{ rotate: openSections[section] ? 180 : 0 }} transition={{ duration: 0.3 }}>
									<ChevronDown size={20} />
								</motion.div>
							</motion.button>
							<AnimatePresence>
								{openSections[section] && (
									<motion.div
										initial={{ opacity: 0, height: 0 }}
										animate={{ opacity: 1, height: "auto" }}
										exit={{ opacity: 0, height: 0 }}
										transition={{ duration: 0.3 }}
										className="mt-2 space-y-2 pl-4 text-gray-300"
									>
										{section === "location" && (
											<>
												<p>
													<span className="font-bold">City:</span> {netInfo.city}
												</p>
												<p>
													<span className="font-bold">Region:</span> {netInfo.region}
												</p>
												<p>
													<span className="font-bold">Country:</span> {netInfo.country_name}
												</p>
												<p>
													<span className="font-bold">Postal Code:</span> {netInfo.postal}
												</p>
												<p>
													<span className="font-bold">Latitude:</span> {netInfo.latitude}
												</p>
												<p>
													<span className="font-bold">Longitude:</span> {netInfo.longitude}
												</p>
											</>
										)}
										{section === "network" && (
											<>
												<p>
													<span className="font-bold">IPv4 Address:</span> {netInfo.ip}
												</p>
												<p>
													<span className="font-bold">ASN:</span> {netInfo.asn}
												</p>
												<p>
													<span className="font-bold">Organization:</span> {netInfo.org}
												</p>
											</>
										)}
										{section === "other" && (
											<p>
												<span className="font-bold">Timezone:</span> {netInfo.timezone.replace(/\//g, ' - ').replace(/_/g, ' ')}
											</p>
										)}
									</motion.div>
								)}
							</AnimatePresence>
						</motion.div>
					))}
				</div>
			</motion.div>
		</div>
	);
};
