import axios from "axios";
import { useEffect, useState } from "react";
import { useUser, isAuthenticated } from "@auth0/nextjs-auth0/client";
import Image from "next/image";
import Link from "next/link";

export default function Display() {
  const [recipes, setRecipes] = useState([]);
  const [page, setPage] = useState(0);
  const [favorites, setFavorites] = useState({});
  const [expanded, setExpanded] = useState({});
  const { user, isLoading, error } = useUser();
  // console.log("USER: ", user);

  useEffect(() => {
    const fetchRecipes = async () => {
      const result = await axios.get(
        `https://dummyjson.com/recipes?limit=20&skip=${page * 20}`
      );
      setRecipes(result.data.recipes);
      console.log(result.data.recipes);
    };
    const fetchFavorites = async () => {
      if (user) {
        const result = await axios.get("/api/favorites", {
          params: { userId: user.sub },
        });
        console.log("RESULT ", result);
        const favoriteRecipes = result.data.reduce((acc, fav) => {
          acc[fav.recipeId] = true;
          return acc;
        }, {});
        setFavorites(favoriteRecipes);
        // console.log("jj",favoriteRecipes);
      }
    };

    fetchRecipes();
    fetchFavorites();
  }, [page, user]);

  const handleExpand = async (recipeId) => {
    const isExpanded = expanded[recipeId];
    setExpanded((prevExpanded) => ({
      ...prevExpanded,
      [recipeId]: !isExpanded,
    }));
    console.log(expanded[recipeId]);
  };

  const handleFavorite = async (recipeId) => {
    const isFavorited = favorites[recipeId];
    setFavorites((prevFavorites) => ({
      ...prevFavorites,
      [recipeId]: !isFavorited,
    }));

    if (user) {
      if (isFavorited) {
        await axios.delete("/api/favorites", {
          data: { userId: user.sub, recipeId: recipeId },
        });
      } else {
        await axios.post("/api/favorites", {
          userId: user.sub,
          recipeId: recipeId,
        });
      }
    } else {
      alert("Please login to favorite recipes");
    }
  };

  return (
    <div className="w-screen">
      {user && (
        <div className="text-center bg-gray-800 text-white py-10">
          <h1 className="py-4">
            Welcome <b>{user.nickname}</b>
          </h1>
          <Link
            href="/api/auth/logout"
            className="rounded-md bg-emerald-500 px-4 py-2 text-white hover:bg-emerald-600"
          >
            Log out
          </Link>
        </div>
      )}

      <h1 className="font-bold text-3xl text-center">Recipes</h1>
      <p className="p-2 text-center">
        Press ❤️ to save your favourite recipes.
      </p>
      {isAuthenticated && <h1>{user.email}</h1>}
      <div className="text-center flex flex-col items-center">
        {recipes.length === 0 && <h1>No items to display</h1>}
        {recipes.map((recipe) => (
          <div
            key={recipe.id}
            className="border-2 border-black my-2 w-2/3 md:w-1/3"
          >
            <div className="flex justify-center">
              <img src={recipe.image} alt="" className="w-auto h-1/2" />
            </div>
            <div className="flex justify-center">
              <p className="font-semibold">{recipe.name}</p>
              <button
                onClick={() => handleFavorite(recipe.id)}
                className="px-2"
              >
                {!favorites[recipe.id] ? (
                  <svg
                    className="w-[20px] h-[20px]"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M12 6.00019C10.2006 3.90317 7.19377 3.2551 4.93923 5.17534C2.68468 7.09558 2.36727 10.3061 4.13778 12.5772C5.60984 14.4654 10.0648 18.4479 11.5249 19.7369C11.6882 19.8811 11.7699 19.9532 11.8652 19.9815C11.9483 20.0062 12.0393 20.0062 12.1225 19.9815C12.2178 19.9532 12.2994 19.8811 12.4628 19.7369C13.9229 18.4479 18.3778 14.4654 19.8499 12.5772C21.6204 10.3061 21.3417 7.07538 19.0484 5.17534C16.7551 3.2753 13.7994 3.90317 12 6.00019Z"
                      stroke="#000000"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></path>
                  </svg>
                ) : (
                  <svg
                    viewBox="0 0 15 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-[20px] h-[20px]"
                  >
                    <path
                      d="M4.03553 1C1.80677 1 0 2.80677 0 5.03553C0 6.10582 0.42517 7.13228 1.18198 7.88909L7.14645 13.8536C7.34171 14.0488 7.65829 14.0488 7.85355 13.8536L13.818 7.88909C14.5748 7.13228 15 6.10582 15 5.03553C15 2.80677 13.1932 1 10.9645 1C9.89418 1 8.86772 1.42517 8.11091 2.18198L7.5 2.79289L6.88909 2.18198C6.13228 1.42517 5.10582 1 4.03553 1Z"
                      fill="#ff0059"
                    ></path>
                  </svg>
                )}
              </button>
            </div>
            {!expanded[recipe.id] && (
              <button className="bg-emerald-500 hover:bg-emerald-600 w-full text-white" onClick={() => handleExpand(recipe.id)}>
                Show full Recipe
              </button>
            )}
            {expanded[recipe.id] && (
              <button className="bg-emerald-500 hover:bg-emerald-600 w-full text-white" onClick={() => handleExpand(recipe.id)}>
                Hide full Recipe
              </button>
            )}

            {expanded[recipe.id] && (
              <div className="text-left px-2 md:px-4 py-4">
                <div>
                  <h3 className="text-lg font-semibold">Ingredients</h3>
                  <ul className="list-disc px-2">
                    {recipe.ingredients.map((ingredient, index) => (
                      <li key={index} >{ingredient}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Instructions</h3>
                  <ol className="list-decimal px-2">
                    {recipe.instructions.map((instruction, index) => (
                      <li key={index}>{instruction}</li>
                    ))}
                  </ol>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="flex justify-center">
        <div className="flex justify-between py-4 w-2/3 md:w-1/3">
          <button
            onClick={() => setPage(page - 1)}
            className={`px-2 md:px-4 py-2 rounded-md text-white ${
              page === 0
                ? "bg-emerald-300 cursor-not-allowed disabled:"
                : "bg-emerald-500 hover:bg-emerald-600"
            }`}
            disabled={page === 0}
          >
            Previous Page
          </button>
          <button
            onClick={() => setPage(page + 1)}
            className={`px-2 md:px-4 py-2 rounded-md text-white ${
              recipes.length === 0
                ? "bg-emerald-300 cursor-not-allowed disabled:"
                : " bg-emerald-500 hover:bg-emerald-600"
            }`}
            disabled={recipes.length === 0}
          >
            Next Page
          </button>
        </div>
      </div>
      <div className="bg-gray-800 text-center py-6 text-white">
        Made with ❤️ by{" "}
        <Link href="https://github.com/RishabhJM" className="text-blue-500">
          Rishabh
        </Link>
      </div>
    </div>
  );
}

// if (user) {
//   await axios.post("/api/favorites", {
//     userId: user.sub,
//     recipeId: recipeId,
//   });
// } else {
//   alert("Please login to favorite recipes");
// }
