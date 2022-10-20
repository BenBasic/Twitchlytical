const people = [
	{
		name: "MOISTCR1TIKAL",
		views: 103040,
		image:
			"https://cdn1.dotesports.com/wp-content/uploads/2020/11/15213949/Charlie-Penguinz0.png",
	},
	{
		name: "Emiru",
		views: 24500,
		image:
			"https://yt3.ggpht.com/ytc/AMLnZu-8R7HpB66AznXoaDb5sQFpD4DXbCyqnDncT_yMFw=s900-c-k-c0x00ffffff-no-rj",
	},
	{
		name: "Pokimane",
		views: 3100,
		image:
			"https://upload.wikimedia.org/wikipedia/commons/1/10/Pokimane_2019.png",
	},
	{
		name: "IronMouse",
		views: 4680,
		image:
			"https://wegotthiscovered.com/wp-content/uploads/2022/04/FLtfwy3WQAIDTJW.jpg",
	},
	{
		name: "CDawgVA",
		views: 20003,
		image:
			"https://pbs.twimg.com/profile_images/1528374271407378434/cngzQWHr_400x400.jpg",
	},
	// More people...
];

export default function Clips() {
	return (
		<div className="bg-gray-900">
			<div className="mx-auto py-12 px-4 max-w-7xl sm:px-6 lg:px-8 lg:py-24">
				<div className="space-y-12">
					<div className="space-y-5 sm:space-y-4 md:max-w-xl lg:max-w-3xl xl:max-w-none">
						<h2 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">
							LATEST MOST POPULAR CLIPS
						</h2>
					</div>
					<ul
						role="list"
						className="space-y-4 sm:grid sm:grid-cols-2 sm:gap-6 sm:space-y-0 lg:grid-cols-3 lg:gap-8"
					>
						{people.map((person) => (
							<li
								key={person.name}
								className="py-10 px-6 bg-gray-800 text-center rounded-lg xl:px-10 xl:text-left"
							>
								<div className="space-y-6 xl:space-y-10">
									<img
										className="mx-auto h-40 w-40 rounded-lg xl:w-56 xl:h-56"
										src={person.image}
										alt=""
									/>
									<div className="space-y-2 xl:flex xl:items-center xl:justify-between">
										<div className="font-medium text-lg leading-6 space-y-1">
											<h3 className="text-white">{person.name}</h3>
											<p className="text-indigo-400">{person.views}</p>
										</div>

										<ul
											role="list"
											className="flex justify-center space-x-5"
										></ul>
									</div>
								</div>
							</li>
						))}
					</ul>
				</div>
			</div>
		</div>
	);
}
