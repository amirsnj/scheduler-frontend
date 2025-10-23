import { ref, computed } from "vue";

export function useDateUtils() {
  const currentDate = ref<string>(new Date().toISOString().split("T")[0]);

  const today = computed(() => new Date().toISOString().split("T")[0]);
  
  const tomorrow = computed(() => {
    const date = new Date();
    date.setDate(date.getDate() + 1);
    return date.toISOString().split("T")[0];
  });

  const yesterday = computed(() => {
    const date = new Date();
    date.setDate(date.getDate() - 1);
    return date.toISOString().split("T")[0];
  });

  const formatDate = (dateString: string, locale: string = "en-US"): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString(
      locale === "fa" ? "fa-IR" : "en-US",
      {
        month: "short",
        day: "numeric",
      }
    );
  };

  const formatDateFull = (dateString: string, locale: string = "en-US"): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString(
      locale === "fa" ? "fa-IR" : "en-US",
      {
        year: "numeric",
        month: "long",
        day: "numeric",
      }
    );
  };

  const isToday = (dateString: string): boolean => {
    return dateString === today.value;
  };

  const isTomorrow = (dateString: string): boolean => {
    return dateString === tomorrow.value;
  };

  const isYesterday = (dateString: string): boolean => {
    return dateString === yesterday.value;
  };

  const isOverdue = (deadlineString: string): boolean => {
    const deadline = new Date(deadlineString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return deadline < today;
  };

  const isUpcoming = (dateString: string): boolean => {
    const date = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date > today;
  };

  const addDays = (dateString: string, days: number): string => {
    const date = new Date(dateString);
    date.setDate(date.getDate() + days);
    return date.toISOString().split("T")[0];
  };

  const getDaysDifference = (dateString1: string, dateString2: string): number => {
    const date1 = new Date(dateString1);
    const date2 = new Date(dateString2);
    const diffTime = Math.abs(date2.getTime() - date1.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getWeekDates = (dateString: string): string[] => {
    const date = new Date(dateString);
    const day = date.getDay();
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - day);
    
    const weekDates: string[] = [];
    for (let i = 0; i < 7; i++) {
      const weekDate = new Date(startOfWeek);
      weekDate.setDate(startOfWeek.getDate() + i);
      weekDates.push(weekDate.toISOString().split("T")[0]);
    }
    
    return weekDates;
  };

  const getMonthDates = (dateString: string): string[] => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    const monthDates: string[] = [];
    for (let d = new Date(firstDay); d <= lastDay; d.setDate(d.getDate() + 1)) {
      monthDates.push(d.toISOString().split("T")[0]);
    }
    
    return monthDates;
  };

  return {
    // State
    currentDate,

    // Computed
    today,
    tomorrow,
    yesterday,

    // Methods
    formatDate,
    formatDateFull,
    isToday,
    isTomorrow,
    isYesterday,
    isOverdue,
    isUpcoming,
    addDays,
    getDaysDifference,
    getWeekDates,
    getMonthDates,
  };
}

