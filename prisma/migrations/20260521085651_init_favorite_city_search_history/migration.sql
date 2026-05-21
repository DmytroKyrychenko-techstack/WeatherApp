-- CreateTable
CREATE TABLE "favorite_cities" (
    "id" TEXT NOT NULL,
    "city_name" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "favorite_cities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "search_history" (
    "id" TEXT NOT NULL,
    "search_term" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "search_history_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "favorite_cities_user_id_idx" ON "favorite_cities"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "favorite_cities_user_id_city_name_key" ON "favorite_cities"("user_id", "city_name");

-- CreateIndex
CREATE INDEX "search_history_user_id_idx" ON "search_history"("user_id");

-- CreateIndex
CREATE INDEX "search_history_timestamp_idx" ON "search_history"("timestamp");
